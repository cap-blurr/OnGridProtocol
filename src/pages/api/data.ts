import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const response = await fetch("https://ogp-backend-4lqr.onrender.com/api/data");
      
      if (!response.ok) {
        throw new Error("Failed to fetch data from external API");
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error"  });
    }
  }
  