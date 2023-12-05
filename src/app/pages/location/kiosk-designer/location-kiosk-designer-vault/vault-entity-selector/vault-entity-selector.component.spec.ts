import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultEntitySelectorComponent } from './vault-entity-selector.component';

type TestVaultEntity = {
  name: string;
  id: string;
};

describe('VaultEntitySelectorComponent', () => {
  let component: VaultEntitySelectorComponent<TestVaultEntity, TestVaultEntity>;
  let fixture: ComponentFixture<
    VaultEntitySelectorComponent<TestVaultEntity, TestVaultEntity>
  >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VaultEntitySelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultEntitySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
