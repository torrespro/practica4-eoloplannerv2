# EoloPlanner

Este proyecto es una aplicación distribuida formada por diferentes servicios que se comunican entre sí usando API REST y gRPC. La aplicación ofrece un interfaz web que se comunica con el servidor con GraphQL. 

Algunos servicios están implementados con Node.js/Express y otros con Java/Spring. Estas tecnologías deben estar instaladas en el host para poder construir y ejecutar los servicios. También se requiere Docker para ejecutar los servicios auxiliares (MySQL y MongoDB).

Para la construcción de los servicios y su ejecución, así como la ejecución de los servicios auxiliares requeridos se usan scripts implementados en Node.js. Posiblemente no sea el lenguaje de scripting más utilizado para este caso de uso, pero en este caso concreto facilita la interoperabilidad en varios SOs y es sencillo.

## Iniciar servicios auxiliares: MongoDB y MySQL

Los servicios auxiliares se ejecutan con la tecnología de contenedores Docker usando el siguiente comando:

```
$ node exec_aux_services.js
```

## Construir servicios

Descarga las dependencias y construye los proyectos. En proyectos Java usa Maven. En proyectos Node usa NPM:

```
$ node build.js
```

## Ejecutar servicios

Ejecuta los servicios. En proyectos Java usa Maven. En proyectos Node usa esta tecnología directamente:

```
$ node exec.js
```