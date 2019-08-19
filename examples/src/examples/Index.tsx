import React from 'react';

import { ExampleComponent as ExampleGlobalPrimitive } from './global-getting-started';
import { ExampleComponent as ExampleLocalPrimitive } from './local-getting-started';
import { ExampleComponent as ExampleGlobalComplexFromDocumentation } from './global-complex-from-documentation';
import { ExampleComponent as ExampleLocalComplexFromDocumentation } from './local-complex-from-documentation';
import { ExampleComponent as ExamplePerformanceLargeTable } from './performance-demo-large-table';
import { ExampleComponent as ExampleGlobalMultiConsumers } from './global-multiple-consumers';
import { ExampleComponent as ExampleGlobalMultiConsumersFromRoot } from './global-multiple-consumers-from-root';
import { ExampleComponent as ExampleGlobalMultiConsumersStateFragment } from './global-multiple-consumers-statefragment';

import { ExampleComponent as ExamplePluginInitial } from './plugin-initial';
import { ExampleComponent as ExamplePluginInitialStateFragment } from './plugin-initial-statefragment';
import { ExampleComponent as ExamplePluginTouched } from './plugin-touched';
import { ExampleComponent as ExamplePluginLogger } from './plugin-logger';
import { ExampleComponent as ExamplePluginPersistence } from './plugin-persistence';
import { ExampleComponent as ExamplePluginMutate } from './plugin-mutate';
import { ExampleComponent as ExamplePluginValidation } from './plugin-validation';

import { A } from 'hookrouter';

export interface ExampleMeta {
    name: string,
    description: React.ReactElement,
    demo: React.ReactElement;
}

export const ExampleIds = {
    GlobalPrimitive: 'global-getting-started',
    LocalPrimitive: 'local-getting-started',
    GlobalComplexFromDocumentation: 'global-complex-from-documentation',
    LocalComplexFromDocumentation: 'local-complex-from-documentation',
    PerformanceLargeTable: 'performance-demo-large-table',
    GlobalMutlipleConsumers: 'global-multiple-consumers',
    GlobalMutlipleConsumersFromRoot: 'global-multiple-consumers-from-root',
    GlobalMutlipleConsumersStateFragment: 'global-multiple-consumers-statefragment',
    PluginInitial: 'plugin-initial',
    PluginInitialStateFragment: 'plugin-initial-statefragment',
    PluginTouched: 'plugin-touched',
    PluginLogger: 'plugin-logger',
    PluginPersistence: 'plugin-persistence',
    PluginMutate: 'plugin-mutate',
    PluginValidation: 'plugin-validation'
}

const baseUrl = 'https://raw.githubusercontent.com/avkonst/hookstate/master/examples/src/examples/'

export const ExampleCodeUrl = (id: string) => `${baseUrl}${id}.tsx`;

const ExampleLink = (props: {id: string, title?: string}) =>
    <A href={props.id}>{props.title ? props.title : ExamplesRepo.get(props.id)!.name}</A>

const StateLinkHref = () =>
    <code><a href="https://github.com/avkonst/hookstate#statelink">StateLink</a></code>
const StateFragmentHref = () =>
    <code><a href="https://github.com/avkonst/hookstate#usestatelink">StateFragment</a></code>

export const ExamplesRepo: Map<string, ExampleMeta> = new Map();
ExamplesRepo.set(ExampleIds.GlobalPrimitive, {
    name: 'Global State: Primitive Data, Quick Start',
    description: <>Create the state and use it
        within and outside of a React component. Few lines of code. No bolierplate!</>,
    demo: <ExampleGlobalPrimitive />
});
ExamplesRepo.set(ExampleIds.LocalPrimitive, {
    name: 'Local State: Primitive Data, Quick Start',
    description: <>Local component state can be managed in the same way as the global state.
        The difference with the <ExampleLink id={ExampleIds.GlobalPrimitive} /> is
        that the state is automatically created by <code>useStateLink</code> and
        saved per component but not globaly.
        The local state is not preserved when a component is unmounted.
        It is very similar to the original <code>React.useState</code> functionaly,
        but the <StateLinkHref /> has got more features.
        </>,
    demo: <ExampleLocalPrimitive />
});
ExamplesRepo.set(ExampleIds.GlobalComplexFromDocumentation, {
    name: 'Global State: Complex Data, Fully Documented',
    description: <>This example demonstrates most of the core features oh Hookstate and is fully documented
    in the <a href="https://github.com/avkonst/hookstate#api-documentation">API documentation</a>.</>,
    demo: <ExampleGlobalComplexFromDocumentation />
});
ExamplesRepo.set(ExampleIds.LocalComplexFromDocumentation, {
    name: 'Local State: Complex Data, Fully Documented',
    description: <>This example demonstrates most of the core features oh Hookstate and is fully documented
    in the <a href="https://github.com/avkonst/hookstate#api-documentation">API documentation</a>. It is the
    same example as <ExampleLink id={ExampleIds.GlobalComplexFromDocumentation} />,
    but this one uses local (per component) state.</>,
    demo: <ExampleLocalComplexFromDocumentation />
});
ExamplesRepo.set(ExampleIds.GlobalMutlipleConsumers, {
    name: 'Global State: Multiple Consumers via Direct Usage',
    description: <>Demonstrates how multiple components can consume a global state directly.
        If the components consume nested elements of an array or nested properties of an object,
        it is more convenient
        and more performant to pass nested states as properties from a parent component.
        This is demonstrated
        in <ExampleLink id={ExampleIds.GlobalComplexFromDocumentation} /> for array and
        in <ExampleLink id={ExampleIds.GlobalMutlipleConsumersFromRoot} /> for object.
    </>,
    demo: <ExampleGlobalMultiConsumers />
});
ExamplesRepo.set(ExampleIds.GlobalMutlipleConsumersFromRoot, {
    name: 'Global State: Mutliple Consumers via Scoped State Children',
    description: <>The same demo as in the <ExampleLink id={ExampleIds.GlobalMutlipleConsumers} /> example,
        but the global state is consumed by a 'parent' component and 'leaves' of the state
        are passed to the nested components as properties. Nested components
        use <a href="https://github.com/avkonst/hookstate#usestatelink">scoped state</a> to
        optimize rendering performance.
        </>,
    demo: <ExampleGlobalMultiConsumersFromRoot />
});
ExamplesRepo.set(ExampleIds.GlobalMutlipleConsumersStateFragment, {
    name: 'Global State: Mutliple Consumers via State Fragment Children',
    description: <>The same demo as in the <ExampleLink id={ExampleIds.GlobalMutlipleConsumersFromRoot} /> example,
        but the scoped state is created using <StateFragmentHref /> in
        place. <a href="https://github.com/avkonst/hookstate#usestatelink">Scoped state</a> is used to
        optimize rendering performance.
        </>,
    demo: <ExampleGlobalMultiConsumersStateFragment />
});
ExamplesRepo.set(ExampleIds.PerformanceLargeTable, {
    name: 'Performance Demo: Large Table',
    description: <>Watch how Hookstate updates <b><u>1 out of 10000</u> table cells <u>every millisecond</u></b>.
        Stretch the matrix to 100x100 and set 50 cells to update per every 1ms interval. And "Follow the White Rabbit".
        The used <b>scoped state</b> technique is explained
        in <a href="https://github.com/avkonst/hookstate#usestatelink">the documentation</a>.
        </>,
    demo: <ExamplePerformanceLargeTable />
});
ExamplesRepo.set(ExampleIds.PluginInitial, {
    name: 'Plugin: Initial / Modified',
    description: <>Code sample and demo for
    the <a href="https://github.com/avkonst/hookstate#plugins">Initial plugin</a>.</>,
    demo: <ExamplePluginInitial />
});
ExamplesRepo.set(ExampleIds.PluginInitialStateFragment, {
    name: 'Plugin: Initial / Modified + State Fragment',
    description: <>Code sample and demo for
    the <a href="https://github.com/avkonst/hookstate#plugins">Initial plugin</a>.
    The same demo as in the <ExampleLink id={ExampleIds.PluginInitial} /> example,
    but the <a href="https://github.com/avkonst/hookstate#usestatelink">scoped state</a> is created
    using <StateFragmentHref /> component</>,
    demo: <ExamplePluginInitialStateFragment />
});
ExamplesRepo.set(ExampleIds.PluginTouched, {
    name: 'Plugin: Touched',
    description: <>Code sample and demo for
    the <a href="https://github.com/avkonst/hookstate#plugins">Touched plugin</a>.</>,
    demo: <ExamplePluginTouched />
});
ExamplesRepo.set(ExampleIds.PluginValidation, {
    name: 'Plugin: Validation',
    description: <>Code sample and demo for
    the <a href="https://github.com/avkonst/hookstate#plugins">Validation plugin</a>.</>,
    demo: <ExamplePluginValidation />
});
ExamplesRepo.set(ExampleIds.PluginPersistence, {
    name: 'Plugin: Persistence, Local Storage',
    description: <>Code sample and demo for
    the <a href="https://github.com/avkonst/hookstate#plugins">Persistence plugin</a>.</>,
    demo: <ExamplePluginPersistence />
});
ExamplesRepo.set(ExampleIds.PluginMutate, {
    name: 'Plugin: Mutate',
    description: <>Code sample and demo for
    the <a href="https://github.com/avkonst/hookstate#plugins">Mutate plugin</a>.</>,
    demo: <ExamplePluginMutate />
});
ExamplesRepo.set(ExampleIds.PluginLogger, {
    name: 'Plugin: Logger',
    description: <>Code sample and demo for
    the <a href="https://github.com/avkonst/hookstate#plugins">Logger plugin</a>.</>,
    demo: <ExamplePluginLogger />
});
