import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output, Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-visualize-data',
  templateUrl: './visualize-data.component.html',
  styleUrls: ['./visualize-data.component.scss']
})
export class VisualizeDataComponent implements OnChanges {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @ViewChild('popover') popover!: ElementRef;
  @Input() areFilesReady: boolean = false;

  @Output() onUploadClick: EventEmitter<void> = new EventEmitter<void>();

  @Input() adjacencyMatrix: number[][] = [];
  @Input() nodeProps: Array<{ id: number, startDate: string, endDate: string }> = [];

  isMouseOverNode: boolean = false;
  popOverTimeout: any = null;

  startDate:string="";
  endDate:string="";

  constructor(private renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adjacencyMatrix'] && changes['adjacencyMatrix'].currentValue) {
      if (!changes['adjacencyMatrix'].currentValue.length) {
        return;
      }


      this.createGraph(changes['adjacencyMatrix'].currentValue);
    }
  }

  hidePopover() {
    if(!this.isMouseOverNode) {
      this.renderer.setStyle(this.popover.nativeElement, 'visibility', 'hidden');
    }
  }

  createGraph(adjacencyMatrix: number[][]) {
    const nodes = [];
    const links = [];

    // Populate nodes array
    for (let i = 0; i < adjacencyMatrix.length; i++) {
      nodes.push({id: i});
    }

    // Populate links array
    for (let i = 0; i < adjacencyMatrix.length; i++) {
      for (let j = 0; j < adjacencyMatrix[i].length; j++) {
        if (adjacencyMatrix[i][j] === 1) {
          links.push({source: i, target: j});
        }
      }
    }

    const svg = d3.select('svg');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    // Set up force simulation
    // @ts-ignore
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any, i) => d.id).distance(5))
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(15))
      .force('x', d3.forceX().x(d => width / 2))
      .force('y', d3.forceY().y(d => height / 2));

    // Create links
    const link = svg.selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1);

    // Create nodes
    const node = svg.selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 6)
      .attr('fill', 'blue');

    node.on('mouseover', (event, d: any) => {
      this.isMouseOverNode = true;
      clearTimeout(this.popOverTimeout);
      let left = event.pageX;
      let top = event.pageY;


      this.renderer.setStyle(this.popover.nativeElement, "left", `${left}px`);
      this.renderer.setStyle(this.popover.nativeElement, "top", `${top}px`);
      this.renderer.setStyle(this.popover.nativeElement, "visibility", `visible`);


      let currNode = this.nodeProps.find((node) => {
        return +node.id === d.id;
      });

      if(currNode){
        this.startDate = currNode.startDate;
        this.endDate = currNode.endDate;

      }

    });
    node.on('mouseleave', (event, d: any) => {
      this.isMouseOverNode = false;

      this.popOverTimeout = setTimeout(() => {this.hidePopover()}, 500);
    });

    // Enable node drag behavior
    const dragHandler = d3.drag()
      .on('start', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
       // drag not passing edges
        d.fx = Math.max(0, Math.min(width, event.x));
        d.fy = Math.max(0, Math.min(height, event.y));
      })
      .on('drag', (event, d: any) => {
        d.fx = Math.max(0, Math.min(width, event.x));
        d.fy = Math.max(0, Math.min(height, event.y));
      })
      .on('end', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    dragHandler(node as any);

    // Update node and link positions on each tick of the simulation
    simulation.on('tick', () => {
      link
        // @ts-ignore
        .attr('x1', d => d.source.x)
        // @ts-ignore
        .attr('y1', d => d.source.y)
        // @ts-ignore
        .attr('x2', d => d.target.x)
        // @ts-ignore
        .attr('y2', d => d.target.y);

      node
        // @ts-ignore
        .attr('cx', d => d.x)
        // @ts-ignore
        .attr('cy', d => d.y);
    });

    // const scaleFactor = 0.5;

    // Apply the scaling transform to the SVG element
    // svg.attr('transform', `scale(${scaleFactor})`);
  }
}
