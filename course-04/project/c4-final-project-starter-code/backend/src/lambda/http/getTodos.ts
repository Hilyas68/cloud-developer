import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import * as AWS  from 'aws-sdk'

// import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';

const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX

const docClient = new AWS.DynamoDB.DocumentClient()
// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    // const todos = await docClient.scan({
    //   TableName: todosTable
    // }).promise()
  
    const todos = await docClient.query({
      TableName: todosTable,
      IndexName: index,
      KeyConditionExpression: 'paritionKey = :paritionKey',
      ExpressionAttributeValues: {
        ':paritionKey': getUserId
      }
}).promise()

    const items = todos.Items

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
