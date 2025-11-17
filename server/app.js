import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
// CORS 설정 - React 앱(localhost:5173)과 통신하기 위해
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions)); // CORS 허용
app.use(express.json({ limit: '50mb' })); // JSON 파싱 (이미지 업로드를 위해 크기 제한 증가)
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // URL 인코딩된 데이터 파싱

// OPTIONS 요청 처리 (preflight)
app.options('*', cors(corsOptions));

// GET /products - 상품 목록 조회
app.get('/products', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, orderBy = 'id', keyword = '' } = req.query;
    
    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    const skip = (pageNum - 1) * pageSizeNum;

    // 검색 조건 구성
    // PostgreSQL의 경우 mode: 'insensitive'를 사용하려면 Prisma가 지원해야 함
    const where = keyword ? {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } }
      ]
    } : {};

    console.log('[Backend] Query params:', { page: pageNum, pageSize: pageSizeNum, orderBy, keyword });
    console.log('[Backend] Where clause:', JSON.stringify(where, null, 2));

    // 정렬 조건 구성
    let orderByClause = {};
    switch (orderBy) {
      case 'recent':
        orderByClause = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderByClause = { createdAt: 'asc' };
        break;
      case 'price_asc':
        orderByClause = { price: 'asc' };
        break;
      case 'price_desc':
        orderByClause = { price: 'desc' };
        break;
      case 'favorite':
        orderByClause = { favoriteCount: 'desc' };
        break;
      default:
        orderByClause = { favoriteCount: 'desc' };
    }

    // 전체 개수 조회
    const totalCount = await prisma.product.count({ where });
    console.log('[Backend] Total count:', totalCount);

    // 상품 목록 조회 (태그 정보 포함)
    const products = await prisma.product.findMany({
      where,
      skip,
      take: pageSizeNum,
      orderBy: orderByClause,
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
    });

    console.log('[Backend] Found products:', products.length);
    
    if (products.length > 0) {
      console.log('[Backend] First product sample:', JSON.stringify({
        id: products[0].id,
        name: products[0].name,
        category: products[0].category,
        hasImage: !!products[0].image,
        tagsCount: products[0].tags?.length || 0
      }, null, 2));
    }

    // React 컴포넌트가 기대하는 형식으로 데이터 변환
    const transformedProducts = products.map(product => {
      try {
        return {
          id: product.id,
          name: product.name,
          description: product.description || '',
          category: product.category,
          price: product.price,
          stock: product.stock,
          // 스키마의 image 필드를 사용 (productImage가 아니라 image)
          productImage: product.image,
          images: product.image || '/src/assets/products/default.png',
          // 스키마에 favoriteCount 필드가 있음
          favoriteCount: product.favoriteCount || 0,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          // 태그 정보 (선택사항) - 태그가 없을 수 있으므로 안전하게 처리
          tags: (product.tags && Array.isArray(product.tags)) 
            ? product.tags.map(pt => ({
                id: pt.tag?.id,
                name: pt.tag?.name
              })).filter(tag => tag.id && tag.name) // null 제거
            : []
        };
      } catch (error) {
        console.error('[Backend] Error transforming product:', product.id, error);
        // 에러가 발생해도 기본 정보는 반환
        return {
          id: product.id,
          name: product.name || 'Unknown',
          description: product.description || '',
          category: product.category || 'FASHION',
          price: product.price || 0,
          stock: product.stock || 0,
          productImage: product.image,
          images: product.image || '/src/assets/products/default.png',
          favoriteCount: product.favoriteCount || 0,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          tags: []
        };
      }
    });

    const response = {
      products: transformedProducts,
      totalCount,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(totalCount / pageSizeNum)
    };
    
    console.log('[Backend] Sending response:', {
      productsCount: transformedProducts.length,
      totalCount,
      totalPages: response.totalPages
    });
    
    res.json(response);
  } catch (error) {
    console.error('상품 목록 조회 실패:', error);
    res.status(500).json({ 
      message: '상품 목록을 불러오는데 실패했습니다.',
      error: error.message 
    });
  }
});

// GET /products/:id - 특정 상품 조회
app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('[Backend] Fetching product by ID:', id);

    // 상품 조회 (태그 정보 포함)
    const product = await prisma.product.findUnique({
      where: {
        id: id
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
    });

    if (!product) {
      console.log('[Backend] Product not found:', id);
      return res.status(404).json({ 
        message: '상품을 찾을 수 없습니다.',
        id: id
      });
    }

    console.log('[Backend] Found product:', product.name);

    // React 컴포넌트가 기대하는 형식으로 데이터 변환
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price,
      stock: product.stock,
      productImage: product.image,
      images: product.image || '/src/assets/products/default.png',
      favoriteCount: product.favoriteCount || 0,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      tags: (product.tags && Array.isArray(product.tags)) 
        ? product.tags.map(pt => ({
            id: pt.tag?.id,
            name: pt.tag?.name
          })).filter(tag => tag.id && tag.name)
        : []
    };

    res.json(transformedProduct);
  } catch (error) {
    console.error('상품 조회 실패:', error);
    res.status(500).json({ 
      message: '상품을 불러오는데 실패했습니다.',
      error: error.message 
    });
  }
});

// POST /products - 상품 생성
app.post('/products', async (req, res) => {
  try {
    const { name, description, category, price, stock, productImage, image, tags } = req.body;
    // productImage 또는 image 둘 다 지원 (호환성)
    const productImageUrl = productImage || image || null;

    // 필수 필드 검증
    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ 
        message: '필수 필드가 누락되었습니다. (name, category, price, stock)' 
      });
    }

    // Category enum 검증
    const validCategories = ['FASHION', 'BEAUTY', 'SPORTS', 'ELECTRONICS', 'HOME_INTERIOR', 'HOUSEHOLD_SUPPLIES', 'KITCHENWARE'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: `유효하지 않은 카테고리입니다. 가능한 값: ${validCategories.join(', ')}` 
      });
    }

    // 태그 처리: 태그 이름 배열을 받아서 Tag를 찾거나 생성하고 연결
    console.log('[Backend] Received tags:', tags);
    const tagNames = Array.isArray(tags) ? tags : (tags ? [tags] : []);
    console.log('[Backend] Processed tag names:', tagNames);
    const tagConnections = [];

    if (tagNames.length > 0) {
      for (const tagName of tagNames) {
        if (tagName && tagName.trim()) {
          try {
            // 태그가 존재하는지 확인, 없으면 생성
            const tag = await prisma.tag.upsert({
              where: { name: tagName.trim() },
              update: {},
              create: { name: tagName.trim() },
            });
            console.log('[Backend] Tag processed:', tag.name, tag.id);
            tagConnections.push({ tagId: tag.id });
          } catch (tagError) {
            console.error('[Backend] Error processing tag:', tagName, tagError);
            // 태그 처리 실패해도 상품 생성은 계속 진행
          }
        }
      }
    }
    console.log('[Backend] Tag connections:', tagConnections.length);

    // 상품 생성 (태그 연결 포함)
    console.log('[Backend] Creating product with tag connections:', tagConnections.length);
    
    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        category: category, // enum으로 자동 변환됨
        price: parseFloat(price),
        stock: parseInt(stock),
        image: productImageUrl, // 스키마의 image 필드 사용
        tags: tagConnections.length > 0 ? {
          create: tagConnections, // 태그 연결 생성
        } : undefined, // 태그가 없으면 undefined로 설정
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
    });

    console.log('[Backend] Product created. Tags from DB:', product.tags?.length || 0);
    if (product.tags && product.tags.length > 0) {
      console.log('[Backend] Product tags:', product.tags.map(pt => ({
        productTagId: pt.productId,
        tagId: pt.tag?.id,
        tagName: pt.tag?.name
      })));
    }

    // React 컴포넌트가 기대하는 형식으로 데이터 변환
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      productImage: product.image,
      images: product.image || '/src/assets/products/default.png',
      favoriteCount: product.favoriteCount || 0,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      tags: (product.tags && Array.isArray(product.tags) && product.tags.length > 0)
        ? product.tags.map(pt => {
            const tagData = {
              id: pt.tag?.id,
              name: pt.tag?.name
            };
            console.log('[Backend] Mapping tag:', tagData);
            return tagData;
          }).filter(tag => tag.id && tag.name)
        : []
    };
    
    console.log('[Backend] Product created with tags:', transformedProduct.tags.length, 'tags');
    console.log('[Backend] Final tags array:', transformedProduct.tags);

    res.status(201).json(transformedProduct);
  } catch (error) {
    console.error('상품 생성 실패:', error);
    res.status(500).json({ 
      message: '상품 등록에 실패했습니다.',
      error: error.message 
    });
  }
});

// PATCH /products/:id - 상품 정보 수정
app.patch('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, stock, image, productImage, tags } = req.body;
    
    console.log('[Backend] Updating product:', id);
    console.log('[Backend] Received tags:', tags);

    // 상품 존재 확인
    const existingProduct = await prisma.product.findUnique({
      where: { id: id },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!existingProduct) {
      return res.status(404).json({ 
        message: '상품을 찾을 수 없습니다.',
        id: id
      });
    }

    // 업데이트할 데이터 구성
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (image !== undefined || productImage !== undefined) {
      updateData.image = image || productImage || null;
    }

    // 태그 처리: 태그가 제공된 경우 기존 태그를 삭제하고 새 태그로 교체
    if (tags !== undefined && Array.isArray(tags)) {
      console.log('[Backend] Processing tags array:', tags);
      console.log('[Backend] Tags array length:', tags.length);
      
      // 기존 태그 연결 삭제
      await prisma.productTag.deleteMany({
        where: { productId: id }
      });
      console.log('[Backend] Deleted existing tag connections');

      // 새 태그 연결 생성
      const tagNames = tags.filter(tag => {
        const isValid = tag && (typeof tag === 'string' ? tag.trim() : String(tag).trim());
        if (!isValid) {
          console.log('[Backend] Filtered out invalid tag:', tag, typeof tag);
        }
        return isValid;
      });
      
      console.log('[Backend] Filtered tag names:', tagNames);
      console.log('[Backend] Filtered tag names length:', tagNames.length);
      
      const tagConnections = [];

      if (tagNames.length > 0) {
        for (const tagName of tagNames) {
          const tagNameStr = typeof tagName === 'string' ? tagName.trim() : String(tagName).trim();
          console.log('[Backend] Processing tag:', tagNameStr);
          
          if (tagNameStr) {
            try {
              const tag = await prisma.tag.upsert({
                where: { name: tagNameStr },
                update: {},
                create: { name: tagNameStr },
              });
              console.log('[Backend] Tag processed successfully:', tag.name, tag.id);
              tagConnections.push({ tagId: tag.id });
            } catch (tagError) {
              console.error('[Backend] Error processing tag:', tagNameStr, tagError);
              console.error('[Backend] Error details:', tagError.message, tagError.stack);
            }
          } else {
            console.log('[Backend] Skipping empty tag:', tagName);
          }
        }
      }

      console.log('[Backend] Tag connections created:', tagConnections.length);
      console.log('[Backend] Tag connections:', tagConnections);

      // 태그 연결을 updateData에 추가
      if (tagConnections.length > 0) {
        updateData.tags = {
          create: tagConnections
        };
        console.log('[Backend] Added tags to updateData:', tagConnections.length, 'tags');
      } else {
        console.log('[Backend] No tag connections to add');
      }
    } else {
      console.log('[Backend] Tags not provided or not an array:', tags);
    }

    // 상품 업데이트
    console.log('[Backend] Updating product with data:', JSON.stringify(updateData, null, 2));
    const product = await prisma.product.update({
      where: { id: id },
      data: updateData,
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
    });

    console.log('[Backend] Product updated. Tags from DB:', product.tags?.length || 0);
    if (product.tags && product.tags.length > 0) {
      console.log('[Backend] Product tags from DB:', product.tags.map(pt => ({
        productTagId: pt.productId,
        tagId: pt.tag?.id,
        tagName: pt.tag?.name
      })));
    }

    // React 컴포넌트가 기대하는 형식으로 데이터 변환
    const transformedTags = (product.tags && Array.isArray(product.tags)) 
      ? product.tags.map(pt => {
          const tagData = {
            id: pt.tag?.id,
            name: pt.tag?.name
          };
          console.log('[Backend] Mapping tag:', tagData);
          return tagData;
        }).filter(tag => {
          const isValid = tag.id && tag.name;
          if (!isValid) {
            console.log('[Backend] Filtered out invalid tag:', tag);
          }
          return isValid;
        })
      : [];
    
    console.log('[Backend] Transformed tags:', transformedTags);
    console.log('[Backend] Transformed tags length:', transformedTags.length);

    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price,
      stock: product.stock,
      productImage: product.image,
      images: product.image || '/src/assets/products/default.png',
      favoriteCount: product.favoriteCount || 0,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      tags: transformedTags
    };

    console.log('[Backend] Product updated:', product.name);
    res.json(transformedProduct);
  } catch (error) {
    console.error('상품 수정 실패:', error);
    res.status(500).json({ 
      message: '상품 수정에 실패했습니다.',
      error: error.message 
    });
  }
});

// DELETE /products/:id - 상품 삭제
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('[Backend] Deleting product:', id);

    // 상품 존재 확인
    const existingProduct = await prisma.product.findUnique({
      where: { id: id },
      include: {
        tags: true
      }
    });

    if (!existingProduct) {
      return res.status(404).json({ 
        message: '상품을 찾을 수 없습니다.',
        id: id
      });
    }

    console.log('[Backend] Product has', existingProduct.tags?.length || 0, 'tag connections');

    // 1. 먼저 ProductTag 연결 삭제 (외래 키 제약 조건 때문에 필요)
    await prisma.productTag.deleteMany({
      where: { productId: id }
    });
    console.log('[Backend] Deleted ProductTag connections');

    // 2. 그 다음 상품 삭제
    await prisma.product.delete({
      where: { id: id }
    });

    console.log('[Backend] Product deleted:', existingProduct.name);
    res.status(200).json({ 
      message: '상품이 삭제되었습니다.',
      id: id
    });
  } catch (error) {
    console.error('[Backend] 상품 삭제 실패:', error);
    console.error('[Backend] Error details:', error.message);
    console.error('[Backend] Error stack:', error.stack);
    res.status(500).json({ 
      message: '상품 삭제에 실패했습니다.',
      error: error.message 
    });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

