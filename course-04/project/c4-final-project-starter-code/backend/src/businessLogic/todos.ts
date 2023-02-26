import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic

const logger = createLogger("CreateTodo")
const attachmentUtils = new AttachmentUtils();
const todosAcess = new TodosAccess();
export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
    ): Promise<TodoItem> {
    
    logger.info("Create todo is called with userId :: " + userId);

    const todoId = uuid.v4()
    logger.info("todoId :: " + todoId);
    const createdAt = new Date().toISOString();
    const attachmentUrl = attachmentUtils.getAttachmentUrl(todoId);
    const newItem = {
        userId,
        todoId,
        createdAt,
        done : false,
        attachmentUrl: attachmentUrl,
        ...newTodo
    }

    logger.info("newItem :: " + todoId);

    return await todosAcess.createTodoItem(newItem);
    
}

