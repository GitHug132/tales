# Reglas estructurales de los cuentos

## Reductores
Para descomponer un texto de cuentos es necesario
tener en cuenta las siguientes reglas
1. _CR_ + _CR_ = _CR_
2. _SP_ + _SP_ = _SP_
3. Sobre el manejo de |
    1. | cadena | = |cadena|
    2. | cadena || cadena | = |cadena|EMPTY|cadena|

## Formato
| variable | o variables |
titulo en una sola linea
Descripcion en las siguientes lineas
que van despues del titulo
CR # indica el final del cuento

## Comentarios
Cualquier texto que vaya despues del simbolo # se
considera como un comentario que no se tendra en cuenta

## Tabulaciones
Las tabulaciones demarcan los sub-cuentos. De esta
forma tenemos que aquellos cuentos delimitados por
las tabulaciones hacen parte del cuento previo
a las mismas.

E.g.
Titulo 1
Descripcion
  Titulo 2
  Descripcion

  Titulo 3
  Descripcion

Donde, _Titulo 2_ y _Titulo 3_ estan bajo el contexto
dado por _Titulo 1_
