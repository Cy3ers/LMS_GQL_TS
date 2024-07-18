import { gql } from "@apollo/client";

export const NOTIFICATION_SUBSCRIPTION = gql`
  subscription Subscription {
    taskAdded {
      message
    }
  }
`;
