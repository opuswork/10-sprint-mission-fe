import './SecondHandMarket.css';
import './script.js';
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import { getProducts } from "../api/getProducts";


function SecondHandMarket() {
    const navigate = useNavigate();
    const [bestProducts, setBestProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [sortOrder, setSortOrder] = useState("recent");
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const PAGE_SIZE = 10;

    // Fetch best products
    useEffect(() => {
        const fetchBestProducts = async () => {
            try {
                console.log('[SecondHandMarket] Fetching best products...');
                const result = await getProducts({ 
                    page: 1, 
                    pageSize: 4, 
                    orderBy: "favorite" 
                });
                console.log('[SecondHandMarket] Best products result:', result);

                if (Array.isArray(result)) {
                    console.log('[SecondHandMarket] Best products count:', result.length);
                    setBestProducts(result);
                }

                else if (result && typeof result === 'object' && Array.isArray(result.products)) {
                    console.log('[SecondHandMarket] Best products count:', result.products.length);
                    setBestProducts(result.products);
                } else {
                    console.log('[SecondHandMarket] Best products count: 0');
                    setBestProducts([]);
                }
            } catch (error) {
                console.error("[SecondHandMarket] Error fetching best products:", error);
                setBestProducts([]);
            }
        };
        fetchBestProducts();
    }, []);

    // Fetch products with pagination
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log('[SecondHandMarket] Fetching products...', {
                    page: currentPage,
                    pageSize: PAGE_SIZE,
                    orderBy: sortOrder,
                    keyword: searchKeyword
                });
                const result = await getProducts({
                    page: currentPage,
                    pageSize: PAGE_SIZE,
                    orderBy: sortOrder,
                    keyword: searchKeyword
                });
                console.log('[SecondHandMarket] Products result:', result);
                
                if (result && typeof result === 'object' && Array.isArray(result.products)) {
                    const products = result.products;
                    const totalCount = result.totalCount || products.length;
                    console.log('[SecondHandMarket] Items count:', products.length, ', Total count:', totalCount);
                    console.log('[SecondHandMarket] Setting products:', products.length, 'items');
                    if (products.length > 0) {
                        console.log('[SecondHandMarket] First product sample:', products[0]);
                    }
                    setProducts(products);
                    const calculatedTotalPages = Math.ceil(totalCount / PAGE_SIZE);
                    console.log('[SecondHandMarket] Setting totalPages:', calculatedTotalPages, '(total:', totalCount, ', pageSize:', PAGE_SIZE, ')');
                    setTotalPages(calculatedTotalPages);
                } else {
                    console.error('[SecondHandMarket] Invalid response format:', result);
                    console.error('[SecondHandMarket] Result type:', typeof result);
                    setProducts([]);
                    setTotalPages(1);
                }
            } catch (error) {
                console.error("[SecondHandMarket] Error fetching products:", error);
                setError('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
                setProducts([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [currentPage, sortOrder, searchKeyword]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

        // Handle search input change
        const handleSearchInputChange = (e) => {
            setSearchInput(e.target.value);
        };

        // Handle search submission
        const handleSearch = () => {
            setSearchKeyword(searchInput);
            setCurrentPage(1);
            setIsSearching(!!searchInput);
        };

        // Handle search on Enter key press
        const handleSearchKeyPress = (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        };

        // Handle search clear
        const handleSearchClear = () => {
            setSearchInput("");
            setSearchKeyword("");
            setIsSearching(false);
            setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
        setCurrentPage(1);
    };

    const handleMobileSortClick = (value) => {
        setSortOrder(value);
        setCurrentPage(1);
        // Hide mobile dropdown
        document.querySelector('.mobile-sort-dropdown').style.display = 'none';
    };

    return (
        <>
            <main>
                <section>
                <h2 className="section-title">베스트 상품</h2>
                <div className="playlists">
                        {bestProducts.map((product) => (
                            <div key={product.id} className="playlist">
                                <Link to={`/items/${product.id}`} className="playlist-link">
                                    <img 
                                        className="playlist-thumb" 
                                        src={product.images || '/src/assets/icons/products/default.png'} 
                                        alt={product.name}
                                    />
                                </Link>
                                <Link to={`/items/${product.id}`} className="playlist-link">
                                    <div className="playlist-title">
                                        {product.name}
                                    </div>
                                </Link>
                                <div className="playlist-artist">
                                    {product.price.toLocaleString()}원
                                </div>
                                <div className="playlist-like-count">
                                    ♡ {product.favoriteCount}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <div className="section-header">
                        <div className="section-header-left">
                                <h2 className="section-title">
                                    {isSearching 
                                        ? `'${searchKeyword}' 검색 결과`
                                        : '판매중인 상품'
                                    }
                                </h2>
                                <button
                                    className="register-button mobile-only"
                                    onClick={() => navigate('/registration')}
                                >
                                    상품등록하기
                                </button>
                        </div>
                        <div className="section-controls desktop-only">
                            <div className="search-container">
                                <input 
                                    type="text" 
                                    className="search-input" 
                                    placeholder="상품을 검색해보세요"
                                        value={searchInput}
                                        onChange={handleSearchInputChange}
                                        onKeyPress={handleSearchKeyPress}
                                />
                                    {searchInput && (
                                        <button 
                                            className="search-clear-button" 
                                            onClick={handleSearchClear}
                                            aria-label="검색어 지우기"
                                        >
                                            ×
                                        </button>
                                    )}
                                    <button 
                                        className="search-button" 
                                        onClick={handleSearch}
                                        aria-label="검색"
                                    >
                                    <img src="/src/assets/icons/ic_search.svg" alt="검색" width="20" height="20" />
                                </button>
                            </div>
                            <button 
                                className="register-button" 
                                onClick={() => navigate('/registration')}
                            >
                                상품등록하기
                            </button>
                            <select 
                                className="sort-select"
                                value={sortOrder}
                                onChange={handleSortChange}
                            >
                                <option value="recent">최신순</option>
                                <option value="favorite">좋아요순</option>
                            </select>
                        </div>
                        
                        <div className="mobile-controls mobile-only">
                            <div className="mobile-search-bar">
                                <img src="/src/assets/icons/ic_search.svg" alt="검색" width="20" height="20" className="search-icon" />
                                <input 
                                    type="text" 
                                    className="search-input" 
                                    placeholder="상품을 검색해보세요"
                                        value={searchInput}
                                        onChange={handleSearchInputChange}
                                        onKeyPress={handleSearchKeyPress}
                                />
                                    {searchInput && (
                                        <button 
                                            className="search-clear-button" 
                                            onClick={handleSearchClear}
                                            aria-label="검색어 지우기"
                                        >
                                            ×
                                        </button>
                                    )}
                            </div>
                            <button 
                                className="sort-toggle" 
                                aria-label="정렬 옵션"
                                onClick={() => {
                                    const dropdown = document.querySelector('.mobile-sort-dropdown');
                                    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
                                }}
                            >
                                <img src="/src/assets/icons/ic_sort.svg" alt="메뉴" width="45" height="45" />
                            </button>
                            <div className="mobile-sort-dropdown" style={{display: 'none'}}>
                                <button 
                                    className="sort-option" 
                                    onClick={() => handleMobileSortClick('recent')}
                                >
                                    최신순
                                </button>
                                <button 
                                    className="sort-option" 
                                    onClick={() => handleMobileSortClick('favorite')}
                                >
                                    좋아요순
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="playlists">
                        {loading ? (
                            <div style={{ padding: '40px', textAlign: 'center' }}>
                                <p>상품을 불러오는 중...</p>
                            </div>
                        ) : error ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
                                <p><strong>{error}</strong></p>
                            </div>
                        ) : products.length === 0 ? (
                            isSearching ? (
                                <div className="no-results">검색 결과가 없습니다.</div>
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center' }}>
                                    <p>등록된 상품이 없습니다.</p>
                                </div>
                            )
                        ) : (
                            <>
                                {console.log('[SecondHandMarket] Rendering products:', products.length)}
                                {products.map((product) => {
                                    console.log('[SecondHandMarket] Rendering product:', product.id, product.name);
                                    return (
                                        <div key={product.id} className="playlist">
                                            <Link to={`/items/${product.id}`} className="playlist-link">
                                                <img 
                                                    className="playlist-thumb" 
                                                    src={product.images || '/src/assets/products/default.png'} 
                                                    alt={product.name || '상품'}
                                                    onError={(e) => {
                                                        console.error('[SecondHandMarket] Image load error:', product.images);
                                                        e.target.src = '/src/assets/products/default.png';
                                                    }}
                                                />
                                            </Link>
                                            <Link to={`/items/${product.id}`} className="playlist-link">
                                                <div className="playlist-title">
                                                    {product.name || '상품명 없음'}
                                                </div>
                                            </Link>
                                            <div className="playlist-artist">
                                                {product.price ? product.price.toLocaleString() : 0}원
                                            </div>
                                            <div className="playlist-like-count">
                                                ♡ {product.favoriteCount || 0}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </section>

                <section>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </section>
            </main>
        </>
    );
}

export default SecondHandMarket;