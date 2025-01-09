const data = {
    users: [
        { email:'', key:''}
    ],
    appFeatures:{
        primaryTabs:{
            judge:{
                wa_release_1:["Case list"],
                wa_release_2: ["My worl", "All work"]
            },
            caseworker:{
                wa_release_1: ["Case list", "Task list", "Task manager"],
                wa_release_2: ["My worl", "All work"]
            }
        },
        taskListColumns:{
            myTasks: { 
                wa_release_1: ["Case reference", "Case name", "Case category", "Location", "Task", "Date", "Assignee"],
                wa_release_2: ["Case name", "Case category", "Location", "Task", "Age of task"]
            },
            availableTasks: {
                wa_release_1: ["Case reference", "Case name", "Case category", "Location", "Task", "Date"],
                wa_release_2: ["Case name", "Case category", "Location", "Task", "Age of task"]
            }
           
        }
        
    }

};

module.exports = data;

