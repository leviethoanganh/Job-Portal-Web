% Facts: Parents and Children
parent(queen_elizabeth, prince_charles).
parent(queen_elizabeth, princess_ann).
parent(queen_elizabeth, prince_andrew).
parent(queen_elizabeth, prince_edward).

% Facts: Gender
male(prince_charles).
male(prince_andrew).
male(prince_edward).
female(princess_ann).

% Facts: Birth Order (lower number = older)
birth_order(prince_charles, 1).
birth_order(princess_ann, 2).
birth_order(prince_andrew, 3).
birth_order(prince_edward, 4).

% Old Succession Rule: Males first (by order), then Females (by order)
successor(X) :- male(X), birth_order(X, _).
successor(X) :- female(X), birth_order(X, _).