import { useState } from "react";
import { DocumentNode, TypedDocumentNode, useQuery, useMutation } from "@apollo/client";
import client from "../config/apollo/apollo";
import { REGISTER_USER } from "../GQL/mutations";

interface UseGraphQLParams {
  query?: DocumentNode | TypedDocumentNode<any, any>;
  mutation?: DocumentNode | TypedDocumentNode<any, any>;
  variables?: Record<string, any>;
}

interface UseGraphQLOutput<Data = any> {
  data: Data | undefined;
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
  save: (variables?: Record<string, any>) => Promise<any>;
}

const useGraphQL = <Data = any>({ query, mutation, variables }: UseGraphQLParams): UseGraphQLOutput<Data> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const { data, refetch } = useQuery(query as DocumentNode | TypedDocumentNode<any, any>, {
    variables,
    skip: !query,
    client,
    onError: (err) => {
      setLoading(false);
      console.log("Mutation is called during query");
      setError(err);
    }
  });

  const [mutate] = useMutation(REGISTER_USER as DocumentNode | TypedDocumentNode<any, any>, {
    client,
    onError: (err) => {
      setLoading(false);
      console.log("Mutation is called during query");
      setError(err);
    }
  });

  const save = async (newVariables?: Record<string, any>) => {
    setLoading(true);
    setError(undefined);

    try {
      const result = await mutate({ variables: newVariables });
      return result.data;
    } catch (err) {
      setError(err);
      console.log("Mutation is called during query");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch,
    save
  };
};

export default useGraphQL;
