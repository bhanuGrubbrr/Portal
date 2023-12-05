import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ConceptVM } from 'src/app/grubbrr/generated/kioskConfig_pb';

@Component({
  selector: 'app-concept-switcher',
  templateUrl: './concept-switcher.component.html',
  styleUrls: ['./concept-switcher.component.scss'],
})
export class ConceptSwitcherComponent implements OnInit {
  @Input() concepts: ConceptVM[];

  @Input() activeConcept: ConceptVM;

  @Output() conceptChangeEvent = new EventEmitter<ConceptVM>();

  constructor() {}

  selectConcept(concept: ConceptVM) {
    this.conceptChangeEvent.emit(concept);
  }

  image: string | undefined;

  ngOnInit(): void {
    // this.activeConcept=this.concepts.find((x)=>x.id===this.activeConceptId)
    this.image = this.activeConcept?.theme?.media?.categoryHeader;
  }
}
