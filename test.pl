% --- Facts ---
competitor(sumsum, appy).
smart_phone_technology(galactica_s3).
developed(sumsum, galactica_s3).
stole(stevey, galactica_s3).
boss(stevey, appy).

% --- Rules ---
rival(X, Y) :- competitor(X, Y).

business(X) :- smart_phone_technology(X).

unethical(X) :-
    boss(X, Company),
    stole(X, Item),
    business(Item),
    developed(RivalCompany, Item),
    rival(RivalCompany, Company).