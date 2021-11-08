/* eslint-disable fp/no-mutating-methods */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable fp/no-mutation */

import { Runner, reporters, Test, Suite, MochaOptions } from 'mocha'
import { CheckGeneralSchema } from "./check-general"

export default class MochaGroupedReporter extends reporters.Base {
	// TODO: Make a type for reporter options

	constructor(runner: Runner, options: MochaOptions) {
		super(runner, options)

		const {
			EVENT_RUN_END,
			EVENT_SUITE_END,
			EVENT_TEST_PASS,
			EVENT_TEST_FAIL
		} = Runner.constants
		reporters.Base.call(this, runner)


		const individualTests: Test[] = []
		const rootSuites: { [key: string]: Test[] } = {}

		const results: CheckGeneralSchema = {
			name: "Mocha unit tests",
			description: "Mocha unit tests",
			summary: "",
			counts: { failure: 0, warning: 0, notice: 0 },
			byFile: {},
		}

		// TODO: Set reporter options
		runner.on(EVENT_SUITE_END, suite => {
			if (suite.title !== "") {
				const topMostSuite = getTopMostTitledSuite(suite)
				const existingTopSuite = rootSuites[topMostSuite.title]
				rootSuites[topMostSuite.title] = existingTopSuite !== undefined
					? [...existingTopSuite, ...suite.tests]
					: suite.tests
			}
		})

		runner.on(EVENT_TEST_PASS, function(test) {
			individualTests.push(test)
		})

		runner.on(EVENT_TEST_FAIL, function(test) {
			individualTests.push(test)
		})

		runner.on(EVENT_RUN_END, function() {
			const successfulSuiteNames = Object.keys(rootSuites).filter(sName => rootSuites[sName].every(t => t.state === "passed"))
			const individualFailures = individualTests.filter(t => t.state !== "passed")

			results.counts.notice = successfulSuiteNames.length
			results.counts.failure = individualFailures.length
			results.byFile["General"] = {
				summary: "",
				counts: { failure: results.counts.failure, warning: 0, notice: results.counts.notice },
				details: [
					...successfulSuiteNames.map((sName, i) => ({
						Id: `success-${i}`,
						title: sName,
						message: `${rootSuites[sName].length} tests passed`,
						category: "notice" as CheckGeneralSchema["byFile"]["details"]["details"][0]["category"],
						rawDetails: rootSuites[sName].map(t => t.title).join("\n")
					})),
					...individualFailures.map((f, i) => ({
						Id: `failure-${i}`,
						title: f.title,
						message: f.err?.message || "Error",
						category: "failure" as CheckGeneralSchema["byFile"]["details"]["details"][0]["category"]
					}))
				]
			} // as CheckGeneralSchema["byFile"]

			console.log(JSON.stringify(results, null, 2))

			// TODO: Pass in reporterOptions for boolean to save in a particular file, get the saved file and compare it to the test file required
		})
	}
}

const getTopMostTitledSuite = (suite: Suite): Suite => {
	return (suite.parent === undefined || suite.parent.title === "") ? suite : getTopMostTitledSuite(suite.parent)
}
