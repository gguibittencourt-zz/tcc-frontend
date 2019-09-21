import {ExpectedResult} from "./expected-result";
import {Rating} from "./rating";

export class Process {
    idProcess: string;
	name: string;
	prefix: string;
    purpose: string;
    expectedResults: ExpectedResult[];
    ratingExpectedResult: Rating;
}
