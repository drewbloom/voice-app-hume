import "server-only";
import casesData from './cases.json';

const getCaseByTitle = (caseTitle) => {

    const foundCase = casesData.find(caseItem => caseItem.case_title === caseTitle);

    return foundCase || null;
};

export default getCaseByTitle;