# TimelineFrontend

Requires https://github.com/willloZA/Timeline-Api.git to host.

After cloning and npm installing, make ngx-sails-updates.sh executable and run it to update the ngx-sails packages rxjs imports as ng build will fail until this is fixed. Commands below.

```
git clone https://github.com/willloZA/Timeline-Frontend.git
cd Timeline-Frontend/
npm i
chmod +x ngx-sails-updates.sh
./ngx-sails-updates.sh
ng build
```

Once built you can move the the contents of dist/timeline-frontend/ into the Timeline-Api/assets/ directory to be hosted.

Windows equivilant in progress.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
