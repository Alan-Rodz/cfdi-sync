// ********************************************************************************
export const logConsoleError = (error: unknown, metadata: string) => {
 if (error instanceof Error) {
  console.error(`${metadata}: ${error.message}`);
 } /* else -- not an error */

 console.error(metadata);
 console.error(error);
}
