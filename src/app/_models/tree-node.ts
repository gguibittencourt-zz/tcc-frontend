import {ExpectedResult} from "./expected-result";
import {MetricScale} from "./metric-scale";

export class TreeNode {
    idTreeNode: string;
    name: string;
    children?: TreeNode[];
    expectedResults?: ExpectedResult[];
    percentage?: number;
    hasMetricScale?: boolean;
	metricScale?: MetricScale[];
	valueMetrics?: any;
	isInvalid?: boolean;
}
