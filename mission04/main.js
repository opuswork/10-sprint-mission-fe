/** 
 * Sprint mission 4
 * 
 * Article 관련 함수들
*/

//1. getArticleList() function
import { getArticleList } from './ArticleService.js';

const data1 = await getArticleList({ page:1, pageSize:10, orderBy:'recent', keyword:'' });
console.log(data1);


// 2. getArticle() function
import { getArticle } from './ArticleService.js';

const getArticleId = await getArticle(5131);
console.log(getArticleId);

// //3. createArticle() function

import { createArticle } from './ArticleService.js';

const articlesData1 = {
  "image": "https://example.com/...",
  "content": " Funny test 게시글 내용입니다.",
  "title": " Funny test 게시글 제목입니다."
};

try {
    const articleOne = await createArticle(articlesData1);
    console.log(articleOne);
} catch (err) {
    console.log(`error occurred.`);
}



// 4. patchArticle() function
import { patchArticle } from './ArticleService.js';
const articleId = 5133;
const articlesData = {
    "image": "https://example.com/...",
    "content": " 100000 Weekly Best 게시글 내용입니다.",
    "title": " 1000000 xxxx Weekly Best 게시글 제목입니다."
}
try {
    const data = await patchArticle(articleId, articlesData);
    console.log(data);
} catch (err) {
    console.log(err.message);
}


import { deleteArticle } from './ArticleService.js';

deleteArticle(5128);

/**
 * .then method 사용 비동기 처리
 * 
 */

//getArticleList() function with parameters: page, pageSize, keyword 

import { getArticleList } from './ArticleService.js';

getArticleList();





/** 
 * Sprint mission 4
 * 
 * Product 관련 함수들
*/

//1. getProductList() function
import { getProductList } from './ProductService.js';

const data1 = await getProductList({ page:1,  pageSize:10, orderBy: 'recent', keyword:'' });
console.log(data1);

// 2.getProduct() function
import { getProduct } from './ProductService.js';

const getProductId = await getProduct(2676);
console.log(getProductId);

// 3. createProduct() function
import { createProduct } from './ProductService.js';

const productData1 = {
  "images": [
    "https://example.com/..."
  ],
  "tags": [
    "전자제품"
  ],
  "price": 1000,
  "description": "string",
  "name": "상품 이름"
};

try {
    const productOne = await createProduct(productData1);
    console.log(productOne);
} catch (err) {
    console.log(`error occurred.`);
}


// 4. patchProduct() function
import { patchProduct } from './ProductService.js';
const productId = 2676;
const productDataOne = {
  "images": [
    "https://example.com/..."
  ],
  "tags": [
    "전자제품"
  ],
  "price": 100000,
  "description": "string",
  "name": "갤럭시 S200 Ultra"
}

try {
    const data = await patchProduct(productId, productDataOne);
    console.log(data);
} catch (err) {
    console.log(err.message);
}

// 5. deleteProduct() function
import { deleteProduct } from './ProductService.js';

deleteProduct(2676);

/**
 * .then method 사용 비동기 처리
 * 
 */

//getProductList() function with parameters: page, pageSize, keyword 

import { getProductList } from './ProductService.js';

getProductList();