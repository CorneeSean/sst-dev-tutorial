import { Resource } from "sst";
import { Util } from "@sst-dev-tutorial/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const userId = event.requestContext.authorizer?.iam.cognitoIdentity.identityId;
  const params = {
    TableName: Resource.Notes.name,
    // 'Key' defines the partition key and sort key of
    // the item to be retrieved
    Key: {
      userId, // The id of the author
      noteId: event?.pathParameters?.id, // The id of the note from the path
    },
  };

  const result = await dynamoDb.send(new GetCommand(params));
  if (!result.Item) {
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return JSON.stringify(result.Item);
});