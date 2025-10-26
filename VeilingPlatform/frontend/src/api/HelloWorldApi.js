
/**
 * fetches the api from HelloWorldControllere
 * @returns {Promise<{message: string}>}
 */
export async function getMessage() {
  try {
    const response = await fetch("http://localhost:5160/api/helloworld");
    if (!response.ok) {
      throw new Error(`Status: ${response.status} Error!`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching HelloWorld message:", error);
    throw error;
  }
}
