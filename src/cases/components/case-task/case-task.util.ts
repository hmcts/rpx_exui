import { Task } from '../../../work-allocation/models/tasks';

export const appendTaskIdAsQueryStringToTaskDescription = (task: Task): string => {
  // The url format will be like the following markdown:
  // 'Click link to proceed to next step [test link next step](/cases/case-details/1547652071308205/trigger/editAppealAfterSubmit)'
  // OR
  // 'first link [first](/first/test/link) second link [second](/second/test/link)'
  // In a nutshell, it can have n number of links

  // For Task Event Start and Completion, when user intiates an event from the tasks tab
  // we need a way to identify the task chosen by the user for further processing
  // The Next steps link is configured and provided by the backend services
  // So, instead of modifying the url, we decided that the safest approach is to
  // append task id as a querystring.

  if (task?.description?.includes(')')) {
    const markdownList = task.description.split(')');
    let newTaskDescription = '';
    markdownList.forEach((markdown) => {
      if (markdown) {
        const taskIdQueryString = markdown.includes('?') ? `&tid=${task.id}` : `?tid=${task.id}`;
        if (markdown.includes('#')) {
          const hashText = markdown.substring(markdown.indexOf('#'));
          const taskDescription = markdown.slice(0, markdown.indexOf('#'));
          newTaskDescription += `${taskDescription}${taskIdQueryString}${hashText})`;
        } else if (markdown.includes('/')) {
          newTaskDescription += `${markdown}${taskIdQueryString})`;
        } else {
          newTaskDescription += `${markdown})`;
        }
      }
    });
    return newTaskDescription;
  } else if (task?.description) {
    return task?.description;
  }
  return '';
};
