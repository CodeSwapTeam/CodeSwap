import { jwtVerify } from "jose";

export const TokenVerify = async (token) =>{

    const secret = new TextEncoder().encode(
        'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
      );

    try {
        const decoded = await jwtVerify(token, secret);
        return decoded.payload;
    } catch (error) {
        return
    }

}

