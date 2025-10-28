/**
 * 
 * 스프린트 미션 4: getProductList() : GET 메서드
 * page, pageSize, keyword
 * 
 * getProduct(), createProduct()
 * request body에 title, content, image 를 포함
 * patchProduct() : PATCH 메서드를 사용
 * deleteProduct() : DELETE 메서드를 사용
 */

//1.getProductList() function with parameters: page, pageSize, keyword 
export async function getProductList(params = {}) {
    const url = new URL(`https://panda-market-api-crud.vercel.app/products`);
    Object.keys(params).forEach((key) => 
        url.searchParams.append(key, params[key])
    );
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

// 2.getProduct() function with id
export async function getProduct(productId) {
    const resAPI = await fetch(`https://panda-market-api-crud.vercel.app/products/${productId}`);
    const data = await resAPI.json();
    console.log(data);
}

// 3.createProduct() function

export async function createProduct(productData) {
    const resAPI_C = await fetch(`https://panda-market-api-crud.vercel.app/products`, {
        method:'POST',
        body: JSON.stringify(productData),
        headers: {
            'Content-Type':'application/json',
        },
    });

    const data = await resAPI_C.json();
    return data;
}


// 4. patchProduct() patch request
export async function patchProduct(productId, productData) {
    const resq = await fetch(`https://panda-market-api-crud.vercel.app/products/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify(productData),
        headers: {
            'Content-Type':'application/json',
        },
    });

    const product1 = await resq.json();
    return product1;

}


//  5. deleteProduct() delete request
export async function deleteProduct(productId) {
    try {
        const delReqProd = await fetch(`https://panda-market-api-crud.vercel.app/products/${productId}`, {
            method:'DELETE',
            headers: {
                'Content-Type':'application/json',
            },
        });

        if (delReqProd.ok) {
            console.log(`Resource with ID ${productId} deleted successfully.`);
        } else {
            console.error(`Failed to delete Product with ID ${productId}. Status: ${productId.status}`);
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

//getProductList() function with parameters: page, pageSize, keyword 
export async function getProductList(params = {}) {
    const res = await instance.get(
    '/products', { 
        params 
    });
    //return res.data;
}


//getProduct() get request with parameter: id
export async function getProduct(id) {
    try {
        const res = await instance.get(
        `/products/${id}`
        );
        return res.data;
    } catch (err) {
        console.log(`Failed to load data for some reason \n`, err);
    }

}


// //createProduct() post request
export async function createProduct(ProductsData) {
    const res = await instance.post(
        `/products`, 
        ProductsData
    );

    return res.data;
}


// patchProduct() patch request
export async function patchProduct(ProductId, ProductsData) {
    try {
        // PATCH /Products/:id with the Product data in the request body
        const resq = await instance.patch(`/Products/${ProductId}`, ProductsData);
        return resq.data;
    } catch (err) {
        console.log(`Failed to update the Product \n`, err);
        // rethrow so caller can handle the error if needed
        throw err;
    }
}

// //deleteProduct() delete request
export async function deleteProduct(ProductId) {
    try {
        const delReq = await instance.delete(`/Products/${ProductId}`);

        // axios responses don't have an `ok` property (that's from fetch API).
        // Use HTTP status code to determine success (2xx range).
        if (delReq && delReq.status >= 200 && delReq.status < 300) {
            console.log(`Resource with ID ${ProductId} deleted successfully.`);
            return true;
        } else {
            console.error(`Failed to delete Product with ID ${ProductId}. Status: ${delReq && delReq.status}`);
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

//getProductList() function with parameters: page, pageSize, keyword 
export async function getProductList() {
    try {
        const res = await fetch('https://panda-market-api-crud.vercel.app/Products');
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

