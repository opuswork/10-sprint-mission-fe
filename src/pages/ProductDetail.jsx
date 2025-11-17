import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../api/getProducts';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[ProductDetail] Fetching product:', id);
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error('[ProductDetail] Error:', err);
        setError(err.message || '상품을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-loading">
          <p>상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-error">
          <p><strong>{error}</strong></p>
          <button onClick={() => navigate('/items')} className="back-button">
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-error">
          <p>상품을 찾을 수 없습니다.</p>
          <button onClick={() => navigate('/items')} className="back-button">
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const categoryLabels = {
    FASHION: '패션',
    BEAUTY: '뷰티',
    SPORTS: '스포츠',
    ELECTRONICS: '전자제품',
    HOME_INTERIOR: '홈인테리어',
    HOUSEHOLD_SUPPLIES: '생활용품',
    KITCHENWARE: '주방용품',
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-header">
        <button onClick={() => navigate('/items')} className="back-button">
          ← 목록으로
        </button>
      </div>
      
      <div className="product-detail-content">
        <div className="product-detail-image-section">
          <img 
            src={product.images || '/src/assets/products/default.png'} 
            alt={product.name}
            className="product-detail-image"
            onError={(e) => {
              e.target.src = '/src/assets/products/default.png';
            }}
          />
        </div>
        
        <div className="product-detail-info-section">
          <div className="product-detail-title-section">
            <h1 className="product-detail-name">{product.name}</h1>
            <button 
              onClick={() => navigate(`/items/${product.id}/edit`)} 
              className="edit-button"
            >
              수정
            </button>
          </div>
          
          <div className="product-detail-category">
            {categoryLabels[product.category] || product.category}
          </div>
          
          {product.description && (
            <div className="product-detail-description">
              <h3>상품 설명</h3>
              <p>{product.description}</p>
            </div>
          )}
          
          <div className="product-detail-price-section">
            <div className="product-detail-price">
              {product.price ? product.price.toLocaleString() : 0}원
            </div>
            <div className="product-detail-favorite">
              ♡ {product.favoriteCount || 0}
            </div>
          </div>
          
          <div className="product-detail-stock">
            <strong>재고:</strong> {product.stock || 0}개
          </div>
          
          {product.tags && product.tags.length > 0 && (
            <div className="product-detail-tags">
              <h3>태그</h3>
              <div className="tags-list">
                {product.tags.map((tag) => (
                  <span key={tag.id || tag} className="tag-item">
                    {typeof tag === 'object' ? tag.name : tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="product-detail-meta">
            <div className="product-detail-date">
              <strong>등록일:</strong> {new Date(product.createdAt).toLocaleDateString('ko-KR')}
            </div>
            {product.updatedAt && product.updatedAt !== product.createdAt && (
              <div className="product-detail-date">
                <strong>수정일:</strong> {new Date(product.updatedAt).toLocaleDateString('ko-KR')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

