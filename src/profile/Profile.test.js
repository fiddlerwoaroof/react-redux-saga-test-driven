import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import createSample from "../test/sample";
import {render} from "@testing-library/react";
import Profile from "./Profile";

test('some profiles', async () => {
    // given
    const sample = createSample()
    const profiles = sample.profileArray(3)

    // when
    const rendered = render(<Profile profiles={profiles}/>)

    // then
    expect(rendered.getByText('3 profiles')).toBeInTheDocument()
    expect(rendered.getByText(profiles[0].name)).toBeInTheDocument()
    expect(rendered.getByText(profiles[1].name)).toBeInTheDocument()
    expect(rendered.getByText(profiles[2].name)).toBeInTheDocument()
})
