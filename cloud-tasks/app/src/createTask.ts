import { v2beta3 } from '@google-cloud/tasks';

export const createHttpTaskWithToken = async (
  project: string,
  queue: string,
  location: string,
  url: string,
  email: string
): Promise<void> => {
  const client = new v2beta3.CloudTasksClient();

  const parent = client.queuePath(project, location, queue);

  const task = {
    httpRequest: {
      httpMethod: 1,
      url,
      oidcToken: {
        serviceAccountEmail: email,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  const response = await client.createTask({ parent, task });
  const responseName = response[0].name ? response[0].name : '';
  console.log(`Created task ${responseName}`);
};
