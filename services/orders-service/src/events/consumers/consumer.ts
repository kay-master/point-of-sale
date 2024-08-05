// import { AuthEvent, ConsumerStatus, MessageData } from '@libs/services';
// import { updateEmployeeId } from '../../services/accounts.service';

// export async function msgConsumer(
// 	message: MessageData
// ): Promise<ConsumerStatus | void> {
// 	console.log('Received message', message);
// 	switch (message.routingKey) {
// 		case AuthEvent.EMPLOYEE_ID_UPDATED: {
// 			return await updateEmployeeId(message.data);
// 		}
// 	}

// 	return ConsumerStatus.REQUEUE;
// }
