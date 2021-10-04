/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface CheckGeneralSchema {
  /**
   * Name of code check
   */
  name?: string;
  /**
   * Description of code check
   */
  description?: string;
  /**
   * Summary of results of code check
   */
  summary?: string;
  /**
   * Overall counts of different categories of messages
   */
  counts: {
    /**
     * Number of notice/successful messages
     */
    notice?: number;
    /**
     * Number of warning messages
     */
    warning?: number;
    /**
     * Number of failure message
     */
    failure: number;
  };
  /**
   * Check results per each code file
   */
  byFile: {
    [k: string]: {
      summary?: string;
      /**
       * Counts of different categories of messages for a specific code file
       */
      counts: {
        /**
         * Number of notice/successful messages
         */
        notice?: number;
        /**
         * Number of warning messages
         */
        warning?: number;
        /**
         * Number of failure message
         */
        failure: number;
      };
      details: {
        /**
         * Id of message
         */
        Id?: string;
        /**
         * Title of message
         */
        title?: string;
        /**
         * Message content
         */
        message: string;
        /**
         * Message category
         */
        category: "notice" | "warning" | "failure";
        startLine?: number;
        startColumn?: number;
        endLine?: number;
        endColumn?: number;
        rawDetails?: string;
      }[];
    };
  };
}