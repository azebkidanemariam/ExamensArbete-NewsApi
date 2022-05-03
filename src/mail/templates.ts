export const addMemberEmail = (name: string, password: string) => {
    return `<p><strong>${name} har lagt till dig som medlem på sitt familjekonto!
    </strong><br><br>Ditt personliga konto är skapat och allt du behöver göra för att komma igång är att ladda ner appen 
    <a href="https://apps.apple.com/se/app/spotify-musik-och-podcasts/id324684580">här</a> 
    och logga in. Ditt tillfälliga lösenord är: <strong>${password}</strong></p>`;
  };
  
  export const removeMemberEmail = (name: string) => {
    return `<p><strong>${name} har tagit bort dig som medlem på sitt familjekonto.
    </strong><br><br>Men oroa dig inte, ditt personliga konto finns kvar och du har möjlighet att teckna en egen prenumeration när du loggar in nästa gång så att du kan fortsätta använda appen som vanligt.`;
  };
  
  export const verificationEmail = (link: string) => {
    return `<p>Klicka här för bekräfta din e-postadress <strong>${link}
    </strong><br><br>Ditt personliga konto är skapat och allt du behöver göra för att komma igång är att ladda ner appen 
    <a href="https://apps.apple.com/se/app/spotify-musik-och-podcasts/id324684580">här</a> 
    och logga in.</p>`;
  };
  
  export const passwordResetEmail = (password: string) => {
    return `<p>Hej! ditt nya lösenord är:  <strong>${password}
            </strong><br><br>
            Med glada hälsningar Gossip24 :)
            `;
  };
  