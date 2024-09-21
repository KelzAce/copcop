function slugify(str: string) {
    if (!str) return null;
  
    return (
      str
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        // eslint-disable-next-line no-useless-escape
        .replace(/[^\w\-]+/g, '')
        // eslint-disable-next-line no-useless-escape
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
    );
  }
  
  function generateRandomNumber(length: number) {
    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
  
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString();
  }
  
  function fromAlphanumeric(text: string) {
    const stringWithHyphen = text.replace(/^(.{5})(.*)$/, '$1-$2');
  
    return stringWithHyphen.toUpperCase();
  }
  
  function generateRandomPassword(length = 12) {
    const charTypes = [
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // Uppercase letters
      'abcdefghijklmnopqrstuvwxyz', // Lowercase letters
      '0123456789', // Numbers
      '!@#$%^&*()-_=+<>?/[]{}|', // Special characters
    ];
  
    function getRandomCharacter() {
      const charTypeIndex = Math.floor(Math.random() * charTypes.length);
      const characters = charTypes[charTypeIndex];
      const randomCharIndex = Math.floor(Math.random() * characters.length);
      return characters[randomCharIndex];
    }
  
    return Array.from({ length }, getRandomCharacter).reduce(
      (password, char) => password + char,
      '',
    );
  }
  
  export {
    slugify,
    generateRandomNumber,
    fromAlphanumeric,
    generateRandomPassword,
  };
  