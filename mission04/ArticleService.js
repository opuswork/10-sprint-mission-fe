/**
 * 
 * 스프린트 미션 4: getArticleList() : GET 메서드
 * page, pageSize, keyword
 * 
 * getArticle(), createArticle()
 * request body에 title, content, image 를 포함
 * patchArticle() : PATCH 메서드를 사용
 * deleteArticle() : DELETE 메서드를 사용
 */

//getArticleList() function with parameters: page, pageSize, keyword 
export async function getArticleList(params = {}) {
    const url = new URL(`https://panda-market-api-crud.vercel.app/articles`);
    Object.keys(params).forEach((key) => 
        url.searchParams.append(key, params[key])
    );
    const res = await fetch(url);
    const data = await res.json();
    return data;
}


//getArticle() get request with parameter: id
export async function getArticle(id) {
    const res = await fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`);
    const data = await res.json();
    return data;
}


//createArticle() post request
export async function createArticle(articlesData) {
    const res = await fetch(`https://panda-market-api-crud.vercel.app/articles`, {
        method: 'POST',
        body: JSON.stringify(articlesData),
        headers: {
            'Content-Type':'application/json'
        },
    });

    const data = await res.json();
    return data;
}


//patchArticle() patch request
export async function patchArticle(articleId, articlesData) {
    const resq = await fetch(`https://panda-market-api-crud.vercel.app/articles/${articleId}`, {
        method: 'PATCH',
        body: JSON.stringify(articlesData),
        headers: {
            'Content-Type':'application/json',
        },
    });
    const article1 = await resq.json();
    return article1;
}

//deleteArticle() delete request
export async function deleteArticle(articleId) {
    try {
        const delReq = await fetch(`https://panda-market-api-crud.vercel.app/articles/${articleId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json',
            },
        });

        if (delReq.ok) {
            console.log(`Resource with ID ${articleId} deleted successfully.`);
        } else {
            console.error(`Failed to delete article with ID ${articleId}. Status: ${articleId.status}`);
        }
    } catch (err) {
        console.error('Error during DELETE request:', err);
    }
}

//axios 를 사용하여 request
import axios from "axios";

const instance = axios.create({
    baseURL: 'https://panda-market-api-crud.vercel.app',
    // increase timeout to 10s to allow slower network responses
    timeout: 10000,
});

//getArticleList() function with parameters: page, pageSize, keyword 
export async function getArticleList(params = {}) {
    const res = await instance.get(
    '/articles', { 
        params 
    });
    //return res.data;
}


//getArticle() get request with parameter: id
export async function getArticle(id) {
    try {
        const res = await instance.get(
        `/articles/${id}`
        );
        return res.data;
    } catch (err) {
        console.log(`Failed to load data for some reason \n`, err);
    }

}


// //createArticle() post request
export async function createArticle(articlesData) {
    const res = await instance.post(
        `/articles`, 
        articlesData
    );

    return res.data;
}


// patchArticle() patch request
export async function patchArticle(articleId, articlesData) {
    try {
        // PATCH /articles/:id with the article data in the request body
        const resq = await instance.patch(`/articles/${articleId}`, articlesData);
        return resq.data;
    } catch (err) {
        console.log(`Failed to update the article \n`, err);
        // rethrow so caller can handle the error if needed
        throw err;
    }
}

// //deleteArticle() delete request
export async function deleteArticle(articleId) {
    try {
        const delReq = await instance.delete(`/articles/${articleId}`);

        // axios responses don't have an `ok` property (that's from fetch API).
        // Use HTTP status code to determine success (2xx range).
        if (delReq && delReq.status >= 200 && delReq.status < 300) {
            console.log(`Resource with ID ${articleId} deleted successfully.`);
            return true;
        } else {
            console.error(`Failed to delete article with ID ${articleId}. Status: ${delReq && delReq.status}`);
            return false;
        }
    } catch (err) {
        console.error('Error during DELETE request:', err);
    }
}


/**
 * .then method 사용 비동기 처리
 * 
 */

//getArticleList() function with parameters: page, pageSize, keyword 
export async function getArticleList() {
    try {
        const res = await fetch('https://panda-market-api-crud.vercel.app/articles');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await res.json();

        Promise.resolve(data)
        .then(processedData => {
            console.log(`Data received and processed:`, processedData);
        }).catch(err => {
            console.error("Error during data processing:", err);
        });
    } catch (err2) {
        console.error("Fetch operation failed:", err2);
    }
}

