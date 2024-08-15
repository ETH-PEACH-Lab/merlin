grammar DataGrammar

entry Data:
    'data:' definitions+=Definition*;

Definition:
    ArrayDef | MatrixDef | StackDef | LinkedListDef;

ArrayDef:
    type='array' name=ID '=' '[' elements+=ArrayElement (',' elements+=ArrayElement)* ']';

MatrixDef:
    type='matrix' name=ID '=' '[' elements+=MatrixElement (',' elements+=MatrixElement)* ']';

StackDef:
    type='stack' name=ID '=' '[' elements+=ArrayElement (',' elements+=ArrayElement)* ']';

LinkedListDef:
    type='linkedlist' name=ID '=' '[' elements+=ArrayElement (',' elements+=ArrayElement)* ']';

ArrayElement:
    SimpleArray | Repeat;

MatrixElement:
    SimpleMatrix | Repeat;

SimpleArray:
    '[' values+=INT (',' values+=INT)* ']';

SimpleMatrix:
    '[' rows+=SimpleArray (',' rows+=SimpleArray)* ']';

Repeat:
    repeat='*';

terminal ID: /[_a-zA-Z][_a-zA-Z0-9]*/;
terminal INT: /[0-9]+/;
