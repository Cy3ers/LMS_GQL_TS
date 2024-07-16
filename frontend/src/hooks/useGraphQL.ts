// ./hooks/useGraphQL.ts

import { useState } from "react";
import { gql } from "@apollo/client";
import client from "../config/apollo/apollo";

const useGraphQL = (endpoint: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gqlRequest = async (query: string, variables?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.query({ query: gql(query), variables });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { gqlRequest, loading, error };
};

export default useGraphQL;
