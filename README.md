# 스프린트 미션4

Async/await 과 fetch/axios 를 활요하여 panda-market-test 서버에 api 로 request 하여

Product 와 Article 데이타를 CRUD(Create, Read, Update, Delete) 하는 DB 엑세스 자바스크립트 코드 작성 및 실행, 결과 확인

ProductService.js 에서 Fetch/Axios 를 사용하여 Product 관련 Document DB 에 request(GET, POST, PATCH, DELETE) 하는 함수를 생성하였고,

ArticleService.js 에서 Fetch/Axios 를 사용하여 Article 관련 Document DB 에 request(GET, POST, PATCH, DELETE) 하는 함수를 생성하였다.

Main.js에서 위의 두 파일에서 생성한 Request 함수들을 호출하여 Response를 확인하는 코드를 작성하였다.

Product와 Article 각각 5개씩 총 10개의 함수를 생성하였고, .then 을 사용하여 간결하게 바꾼 형식의 구문도 사용하였다.

POST: Product/Article 전체 Request ( Range: Offset 1, Limit: 10 )
/products
/articles

GET: Product/Article 전체 Request ( Range: Offset 1, Limit: 10 )
/products
/articles

GET: Product/Article ID로 해당 데이타 한건의 내용을 json 데이타로 가져온다.
/products/{productId}
/articles/{articleId}

PATCH: Product/Article ID로 해당 데이타 한건의 내용을 수정하여 json 형식으로 보여줌.
/products/{productId}
/articles/{articleId}

DELETE: Product/Article ID로 해당 데이타 한건을 삭제함.
/products/{productId}
/articles/{articleId}


