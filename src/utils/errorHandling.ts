export const errorHandling = async (Promise: any) => {
    try {
        const result = await Promise;
        return result;
    } catch (error) {
        console.error("Error occurred:", error);
        throw error; // Re-throw the error or handle it accordingly
    }
}