# 스프린트 6 - 상품 리스트 표시(React + Prisma ORM)

상품 입력 + 로컬 DB에 데이타 입력, 수정, 삭제 기능 구현

상품 리스트: SecondHandMarket.jsx 에서 getProducts.jsx의 api 호출을 통해서 로컬에 설치된 PostgreSQL 의 product 테이블에 저장된 데이타를 불러오고,

           Registration.jsx 페이지를 통해서 새 데이타를 PostgreSQL 의 product 테이블과 Tags 테이블 밑 ProductTag등의 Relation을 가진

           테이블에 데이타를 입력하고, 수정, 삭제 하는 기능을 구현하였음.

           실제, 데이타를 컨트를 하는 CRUD 기능은 어렵지 않으나, React + Express, Prisma ORM의 구조가 쉽게 이해되지 않았고, React는 명백히 라이브러이이며,

           서버의 개념이 아님. Apache Web Server와 같이 별도의 설치가 필요하지만, React는 철저히 Front-Side의 컴포넌트만을 취급하는 레이어이며,

           Express가 미들웨어의 역할을 해주지만, 보안상 직접적으로 로컬DB에 붙어서 데이타를 핸들링할수 없고, API를 통해서만 데이타를 CRUD 할수 있다는 점이

           타 언어와 차별화된 점이라는 것을 기억해야 합니다.

기타 기술적인 측면은 지속적인 코드 리뷰를 통해서 계속 향상시켜 나가도록 하겠습니다.
