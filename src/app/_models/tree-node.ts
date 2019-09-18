import {ExpectedResult} from "./expected-result";
import {MetricScale} from "./metric-scale";
import {ProcessAttributeValue} from "./process-attribute-value";

export class TreeNode {
    idTreeNode: string;
	name: string;
	prefix: string;
    children?: TreeNode[];
    expectedResults?: ExpectedResult[];
    processAttributeValues?: ProcessAttributeValue[];
    percentage?: number;
    hasMetricScale?: boolean;
	metricScale?: MetricScale[];
	valueMetrics?: any;
	isInvalid?: boolean;
}
