import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './registration.css';

const API_URL = 'http://localhost:3000/products';

const CATEGORIES = [
  'FASHION',
  'BEAUTY',
  'SPORTS',
  'ELECTRONICS',
  'HOME_INTERIOR',
  'HOUSEHOLD_SUPPLIES',
  'KITCHENWARE',
];

const FIELD_LABELS = {
    id: '상품 ID',
    name: '상품 이름',
    description: '상품 설명',
    category: '카테고리',
    price: '가격',
    stock: '재고',
    image: '이미지',
    productImage: '상품 이미지',
    tags: '태그',
    createdAt: '생성일',
    updatedAt: '수정일',
};

function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: CATEGORIES[0], 
    price: 0,
    stock: 0,
    image: '',
    tags: '',
  });

  const [registeredProduct, setRegisteredProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({
        ...prevData,

        [name]: (name === 'price' || name === 'stock') ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisteredProduct(null);
    setError(null);
    setLoading(true);

    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      console.log('[Registration] Tags input:', formData.tags);
      console.log('[Registration] Tags array:', tagsArray);

      // API에 전송할 데이터 준비
      const submitData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        stock: formData.stock,
        productImage: formData.image || null,
        image: formData.image || null,
        tags: tagsArray, // 태그 배열 전송
      };

      console.log('[Registration] Submitting data:', submitData);

      const response = await axios.post(API_URL, submitData);
      
      console.log('[Registration] Response:', response.data);

      if (response.status === 201) {
        setRegisteredProduct(response.data);
        setFormData({
          name: '',
          description: '',
          category: CATEGORIES[0],
          price: 0,
          stock: 0,
          image: '',
          tags: '',
        });
        setImagePreview(null);
      }
    } catch (err) {
      console.error('상품 등록 실패:', err);

      setError(`상품 등록에 실패했습니다: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };


  const handleReset = () => {
    setRegisteredProduct(null);
    setError(null);
    setFormData({
      name: '',
      description: '',
      category: CATEGORIES[0],
      price: 0,
      stock: 0,
      image: '',
      tags: '',
    });
    setImagePreview(null);
  };

  // validate form
  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.price > 0 &&
      formData.stock > 0
    );
  };

  return (
    <div className="registr">
      {/* show form data after sucessfully submitted */}
      {registeredProduct ? (
        <>
          <div className="registr-title">
            <h1 className="res-title">상품 상세 정보</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="registr_button" 
                onClick={() => navigate('/items')}
                style={{ background: '#6B7280' }}
              >
                목록으로
              </button>
              <button 
                className="registr_button" 
                onClick={handleReset}
              >
                상품 등록
              </button>
            </div>
          </div>
          
          {Object.entries(registeredProduct).map(([key, value]) => {
            // tags는 배열이므로 특별 처리
            if (key === 'tags' && Array.isArray(value)) {
              return (
                <div key={key}>
                  <label className="label" htmlFor={`detail-${key}`}>
                    {FIELD_LABELS[key] || key}
                  </label>
                  <input
                    className="input"
                    type="text"
                    id={`detail-${key}`}
                    value={value.map(tag => typeof tag === 'object' ? tag.name : tag).join(', ')}
                    readOnly
                  />
                </div>
              );
            }
            
            // 날짜 필드 처리
            if (key === 'createdAt' || key === 'updatedAt') {
              return (
                <div key={key}>
                  <label className="label" htmlFor={`detail-${key}`}>
                    {FIELD_LABELS[key] || key}
                  </label>
                  <input
                    className="input"
                    type="text"
                    id={`detail-${key}`}
                    value={new Date(value).toLocaleString()}
                    readOnly
                  />
                </div>
              );
            }
            
            // 일반 필드
            return (
              <div key={key}>
                <label className="label" htmlFor={`detail-${key}`}>
                  {FIELD_LABELS[key] || key}
                </label>
                <input
                  className="input"
                  type="text"
                  id={`detail-${key}`}
                  value={value || ''}
                  readOnly
                />
              </div>
            );
          })}
        </>
      ) : (
        <>
          <div className="registr-title">
            <h1 className="res-title">상품 등록 하기</h1>
            <button 
              className="registr_button" 
              type="submit" 
              form="product-form"
              disabled={loading || !isFormValid()}
            >
              {loading ? '등록 중...' : '등록'}
            </button>
          </div>

          {/* product registration form */}
          <form id="product-form" onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor="name">상품 이름 (name)</label>
          <input 
            className="input"
            type="text" 
            id="name"
            name="name" 
            placeholder="상품 이름을 입력하세요" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div>
          <label className="label" htmlFor="description">상품 설명 (description)</label>
          <textarea 
            className="input"
            id="description"
            name="description" 
            placeholder="상품 설명을 입력하세요" 
            value={formData.description} 
            onChange={handleChange} 
            rows="4"
          />
        </div>

        <div>
          <label className="label" htmlFor="category">카테고리 (category)</label>
          <select 
            className="input"
            id="category"
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            required
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="price">가격 (price)</label>
          <input 
            className="input"
            type="number" 
            id="price"
            name="price" 
            placeholder="가격을 입력하세요" 
            value={formData.price} 
            onChange={handleChange} 
            min="0"
            required 
          />
        </div>

        <div>
          <label className="label" htmlFor="stock">재고 (stock)</label>
          <input 
            className="input"
            type="number" 
            id="stock"
            name="stock" 
            placeholder="재고 수량을 입력하세요" 
            value={formData.stock} 
            onChange={handleChange} 
            min="0"
            required 
          />
        </div>

        <div>
          <label className="label" htmlFor="image">상품 이미지 (image)</label>
          <input 
            className="input"
            type="file" 
            id="image"
            name="image" 
            accept="image/*"
            onChange={handleChange}
          />
          {imagePreview && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={imagePreview} 
                alt="미리보기" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px', 
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB'
                }} 
              />
            </div>
          )}
          <input 
            className="input"
            type="text" 
            id="imageUrl"
            name="image" 
            placeholder="또는 이미지 URL을 입력하세요" 
            value={formData.image} 
            onChange={handleChange}
            style={{ marginTop: '10px' }}
          />
        </div>

        <div>
          <label className="label" htmlFor="tags">태그 (tags)</label>
          <input 
            className="input"
            type="text" 
            id="tags"
            name="tags" 
            placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 할인, 신상, 겨울옷)" 
            value={formData.tags} 
            onChange={handleChange}
          />
          <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
            여러 태그를 입력하려면 쉼표(,)로 구분하세요
          </p>
        </div>
      </form>
      
      {/* 에러 메시지 표시 */}
      {error && <p className="error-message show">{error}</p>}
        </>
      )}
    </div>
  );
}

export default Registration;