import { Component } from '@angular/core';
import { LoaderService } from '../loader.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
    isLoading: boolean = false; // Initialize with a default value

    constructor(private loaderService: LoaderService) {
        this.loaderService.isLoading$.subscribe(isLoading => {
            this.isLoading = isLoading;
        });
    }
}
