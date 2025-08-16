import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProjectsComponent } from './pages/projects/projects';
import { InformationsComponent } from './pages/informations/informations';
import { DesignComponent } from './pages/design/design';
import { ContactComponent } from './pages/contact/contact';
import { AuroraPageComponent } from './pages/projects/aurora-page/aurora-page';
import { ZenithPageComponent } from './pages/projects/zenith-page/zenith-page';
import { HephaiPageComponent } from './pages/projects/hephai-page/hephai-page';
import { LuminaPageComponent } from './pages/projects/lumina-page/lumina-page';
import { AnomPageComponent } from './pages/projects/anom-page/anom-page';
import { DesignV2Component } from './pages/design-v2/design-v2';

export const routes: Routes = [
    { path: '', component: HomeComponent, data: { animation: 'HomePage' } },
    { path: 'projects', component: ProjectsComponent, data: { animation: 'ProjectsPage' } },
    { path: 'projects/aurora', component: AuroraPageComponent, data: { animation: 'AuroraPage' } },
    { path: 'projects/zenith', component: ZenithPageComponent, data: { animation: 'ZenithPage' } },
    { path: 'projects/hephai', component: HephaiPageComponent, data: { animation: 'HephaiPage' } },
    { path: 'projects/lumina', component: LuminaPageComponent, data: { animation: 'LuminaPage' } },
    { path: 'projects/anom', component: AnomPageComponent, data: { animation: 'AnomPage' } },
    { path: 'informations', component: InformationsComponent, data: { animation: 'InformationsPage' } },
    { path: 'design', component: DesignV2Component, data: { animation: 'DesignPage' } },
    { path: 'contact', component: ContactComponent, data: { animation: 'ContactPage' } }
];
