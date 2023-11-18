import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { PageNotFoundComponentComponent } from './page-not-found-component.component';

describe('PageNotFoundComponentComponent', () => {
  let component: PageNotFoundComponentComponent;
  let fixture: ComponentFixture<PageNotFoundComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],

      declarations: [PageNotFoundComponentComponent]
    });
    fixture = TestBed.createComponent(PageNotFoundComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
