import { headers } from "next/headers";
import { auth } from "../auth"


const getToken = async()=>{
     const {token} = await auth.api.getToken({
    headers: await headers()

  })
  return token;
}
export default getToken;