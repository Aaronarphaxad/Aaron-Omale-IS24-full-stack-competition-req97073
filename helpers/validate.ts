


export function validateInput(input: { [x: string]: any; Developers: string[]; }) {
    const requiredFields = [
      'productName',
      'productOwnerName',
      'scrumMasterName',
      'methodology',
      'startDate'
    ];
    
    const hasEmptyFields = requiredFields.some(field => !input[field]);
  
    if (hasEmptyFields || !input.Developers.some((dev: string) => dev !== '')) {
      return false;
    }
  
    return true;
  }