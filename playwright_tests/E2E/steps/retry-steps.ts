export async function retryAction(action: () => Promise<void>, numberOfTries: number = 5) {
    for (let i = 0; i < numberOfTries; i++) {
      try {
        await action();
        break; // Exit loop if action succeeds
      } catch (error) {
        console.log(`Action failed, retrying (${i + 1}/${numberOfTries})...`);
        if (i === numberOfTries - 1) throw error; // Rethrow error on last attempt
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
      }
    }
  }