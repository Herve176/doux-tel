import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../authservice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  imports: [],
  templateUrl: './google-callback.component.html',
  styleUrl: './google-callback.component.css',
})
export class GoogleCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthserviceService,
    private router: Router
  ) {}

  ngOnInit() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token'); // Verify this matches your OAuth response

    if (!idToken) {
      console.error('No id_token found in URL');
      this.router.navigate(['/login']);
      return;
    }

    this.authService.googleLogin(idToken).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        console.error('Full error:', err);
        this.router.navigate(['/login']);
      },
    });
  }
}
