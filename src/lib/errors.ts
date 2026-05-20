import { ApolloError } from "@apollo/client";

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApolloError) {
    const graphQLError = error.graphQLErrors[0]?.message;
    if (graphQLError) {
      return graphQLError;
    }
    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
