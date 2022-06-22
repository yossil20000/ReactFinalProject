import React, { useState } from 'react'
import axios from 'axios';

const useFetch = (baseUrl: string) => {
    const [data, setData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    async function GET(): Promise<void> {
        console.log("useFetch GET ");
        setIsFetching(true);

        try {
            const { data } = await axios.get(baseUrl, {
                headers: {
                    "Access-Control-Allow-Origin": true
                }
            });
            setData(data);
            console.log(`useFetch Data Fetch: ${data.length} items`);
        }
        catch (err) {
            console.log("useFetch exception: ", err);
        }
        finally {
            setTimeout(() => {
                setIsFetching(false);
            }, 200);

        }


    }
    const POST = async (title: string) => {
        console.log("useFetch GET ");
        setIsFetching(true);

        try {
            const { data } = await axios.get(baseUrl, {
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": true
                }
            });
            /* setData((prev) => [...prev, { title: `title ${prev.length + 1}` }]); */
            console.log(`useFetch Data Fetch: ${data.length} items`);
        }
        catch (err) {
            console.log("useFetch exception: ", err);
        }
        finally {
            setTimeout(() => {
                setIsFetching(false);
            }, 200)

        }


    };
    interface api  {
        GET:() => void;
        POST: (title:string) => void;
    }
   const API : api ={
       GET: GET,
       POST:POST
   }
    return [data, isFetching, API] as const;
}

export default useFetch