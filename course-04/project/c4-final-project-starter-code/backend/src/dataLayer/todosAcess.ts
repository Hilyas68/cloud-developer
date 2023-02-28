import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
    constructor(
        private readonly docClient : DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly todoIndex = process.env.TODOS_CREATED_AT_INDEX
    ){}

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {

        await this.docClient.put({
            TableName: this.todoTable,
            Item: todoItem
    }).promise()

    return todoItem;
    }

    async getAllTodos(userId : string): Promise<TodoItem[]> {

        const todos = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.todoIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId
            }
        }).promise()

        return todos.Items as TodoItem[];
    }  

    async updateTodoItem(
        userId: string,
         todoId: string, 
        todoUpdate: TodoUpdate
        ): Promise<TodoUpdate>{
        
            await this.docClient.update({
                TableName: this.todoTable,
                Key: {
                    todoId,
                    userId
                },
                UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
                ExpressionAttributeValues: {
                    ':name': todoUpdate.name,
                    ':dueDate': todoUpdate.dueDate,
                    ':done': todoUpdate.done
                },
                ExpressionAttributeNames: {
                    '#name': 'name'
                },
                ReturnValues: 'UPDATED_NEW'
            }).promise()

            return todoUpdate as TodoUpdate;
        }


    async deleteTodoItem(todoId: string, userId: string): Promise<string>{

       await this.docClient.delete({
            TableName: this.todoTable,
            Key:{
                todoId,
                userId
            }
        }).promise()

        return todoId as string
    }    
}

