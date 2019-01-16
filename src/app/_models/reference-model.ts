import {KnowledgeArea} from "./knowledge-area";

export class ReferenceModel {
    idReferenceModel: number;
    name: string;
    purpose: string;
    knowledgeAreas: KnowledgeArea[];
}
