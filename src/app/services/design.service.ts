import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Design } from '../interfaces/design.interface';

@Injectable({
    providedIn: 'root'
})
export class DesignService {
    private jsonPath = 'assets/data/designs.json';

    constructor(private http: HttpClient) { }

    getDesigns(): Observable<Design[]> {
        return this.http.get<{ designs: Design[] }>(this.jsonPath)
            .pipe(
                map(response => response.designs)
            );
    }

    getDesignById(id: string): Observable<Design | undefined> {
        return this.getDesigns().pipe(
            map(designs => designs.find(design => design.id === id))
        );
    }
}